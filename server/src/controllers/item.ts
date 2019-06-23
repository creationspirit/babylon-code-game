import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { Item } from '../models/Item';
import { UserItems } from '../models/UserItems';
import { UserStats } from '../models/UserStats';

const router = Router();

router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const repository = getRepository(Item);
    const items = await repository.find();
    return res.send({ items });
  } catch (e) {
    res.status(400).send({ message: 'Item fetch failed.' });
  }
});

router.post('/buy', auth, async (req: Request, res: Response) => {
  const { itemId, amount } = req.body;
  console.log(itemId, amount);
  try {
    const repository = getRepository(UserItems);
    const itemRepository = getRepository(Item);
    const userStatsRepository = getRepository(UserStats);

    const item = await itemRepository.findOneOrFail(itemId);
    if (item.price * amount > req.user.stats.loc) {
      throw new Error('Not enough LOC.');
    }
    console.log(req.user);
    let userItem = await repository.findOne({ where: { item: itemId, user: req.user.id } });
    console.log('userItem', userItem);
    if (userItem) {
      console.log('updating old');
      await repository.update(
        { item: itemId, user: req.user.id },
        { amount: userItem.amount + amount }
      );
    } else {
      console.log('making new');
      userItem = new UserItems();
      userItem.item = itemId;
      userItem.user = req.user;
      userItem.amount = amount;
      await repository.save(userItem);
    }
    const newLoc = req.user.stats.loc - item.price * amount;
    await userStatsRepository.update({ user: req.user.id }, { loc: newLoc });
    return res.send();
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

export default router;

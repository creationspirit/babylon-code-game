import { Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';

import { auth } from '../middleware/auth';
import { User } from '../models/User';
import { UserStats } from '../models/UserStats';
import { UserStageStats } from '../models/UserStageStats';
import { Stage } from '../models/Stage';
import { fetchUser } from '../config/requests';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { edgarToken } = req.body;
  const repository = getRepository(User);
  const stageRepository = getRepository(Stage);
  try {
    const edgarUser = await fetchUser(edgarToken);
    let user = await repository.findOne({ edgarId: edgarUser.id });

    const stageList = await stageRepository.find({ select: ['id'] });

    if (!user) {
      user = new User();
      user.loadFromEdgarResponse(edgarUser);
      user.stats = new UserStats();
      user.stats.experience = 0;
      user.stats.level = 1;
      user.stats.loc = 0;

      const stageStatsArray: UserStageStats[] = [];
      stageList.forEach((stage: Stage) => {
        const newStageStats = new UserStageStats();
        newStageStats.stage = stage;
        newStageStats.level = 1;
        newStageStats.loc = 0;
        stageStatsArray.push(newStageStats);
      });
      user.stageStats = stageStatsArray;
    } else {
      if (user.stageStats.length === 1 && user.stageStats[0].stage === null) {
        user.stageStats = [];
      }
      stageList.forEach((stage: Stage) => {
        const stageStat = (user as User).stageStats.find(
          (s: UserStageStats) => s.stage.id === stage.id
        );
        if (!stageStat) {
          const newStageStats = new UserStageStats();
          newStageStats.stage = stage;
          newStageStats.level = 1;
          newStageStats.loc = 0;
          (user as User).stageStats.push(newStageStats);
        }
      });
    }
    console.log(user);
    const savedUser = await repository.save(user);
    const token = await savedUser.generateAuthToken();
    res.send({ user: savedUser, token });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: 'This token is not valid.' });
  }
});

router.get('/me', auth, async (req, res) => {
  res.send(req.user);
});

router.get('/', auth, async (req, res) => {
  const repository = getRepository(User);
  const users = await repository.find({
    select: ['id', 'firstName', 'lastName'],
    relations: ['stats', 'achievements'],
  });
  res.send({ users });
});

export default router;

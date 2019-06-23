import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';

const items = [
  {
    name: 'Future Gadget 204',
    description:
      "Use this to travel back in time and add time to countdown in co-op mode. Gadet still isn't perfect so it adds only 5 minutes. Too bad you can't use this on real exam...",
    price: 200,
    imageUrl: '/images/time.svg',
  },
  {
    name: 'Tough cookie icecream',
    description:
      "The Dude that roams level labyrinths doesn't know how to code...but he DOES know how to find you. Better give him this icecream if you don't know the answer to his question. He likes it. Maybe he'll let you go...",
    price: 500,
    imageUrl: '/images/icecream.svg',
  },
];

export class SeedItems1561216358692 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository('item');
    await repository.save(items);
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    const repository = getRepository('item');
    await repository.query('TRUNCATE TABLE item CASCADE');
  }
}

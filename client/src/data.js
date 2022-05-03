import { DateTime } from 'luxon'

const defaultEvents = {
  name: 'root',
  children: [
    {
      name: 'Software Engineer',
      children: [
        {
          name: 'Dave Cranwell2',
          events: [
            {
              id: 'a',
              type: 'stage',
              newStage: 'Technical test',
              startDateMillis: new DateTime.utc(2021, 12, 30, 12, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 1, 3, 12, 0, 0).toMillis(),
            },
            {
              id: 'a',
              type: 'stage',
              newStage: 'Technical test',
              startDateMillis: new DateTime.utc(2021, 12, 30, 12, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 1, 3, 12, 0, 0).toMillis(),
            },
          ],
        },
        {
          name: 'Dave Cranwell',
          events: [
            {
              id: 'b',
              type: 'comment',
              startDateMillis: new DateTime.utc(2022, 1, 10, 12, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 1, 11, 12, 0, 0).toMillis(),
            },
            {
              id: 'd',
              type: 'stage',
              newStage: 'Technical test',
              startDateMillis: new DateTime.utc(2022, 1, 10, 18, 0, 0).toMillis(),
            },
            {
              id: 'd',
              type: 'stage',
              newStage: 'Another stage',
              startDateMillis: new DateTime.utc(2022, 3, 31, 18, 0, 0).toMillis(),
            },
            {
              id: 'e',
              type: 'comment',
              newStage: 'foooooooo',
              offer: '50000',
              startDateMillis: new DateTime.utc(2022, 4, 1, 18, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 4, 1, 19, 30, 0).toMillis(),
            },
          ],
        },
        {
          name: 'Corin Mulliss2',
          events: [
            {
              id: 'c',
              type: 'stage',
              newStage: 'Screening',
              startDateMillis: new DateTime.utc(2022, 1, 12, 12, 0, 0).toMillis(),
            },
          ],
        },
      ],
    },
    {
      name: 'Systems Administrator',
      children: [
        {
          name: 'Corin Mulliss',
          events: [
            {
              id: 'g',
              type: 'stage',
              newStage: 'Offer',
              startDateMillis: new DateTime.utc(2022, 3, 15, 12, 0, 0).toMillis(),
            },
            {
              id: 'f',
              type: 'stage',
              newStage: 'Interview',
              startDateMillis: new DateTime.utc(2022, 3, 31, 9, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 3, 31, 10, 0, 0).toMillis(),
            },
            {
              id: 'f2',
              type: 'stage',
              newStage: 'Interview',
              startDateMillis: new DateTime.utc(2022, 3, 31, 14, 0, 0).toMillis(),
              endDateMillis: new DateTime.utc(2022, 3, 31, 16, 0, 0).toMillis(),
            },
          ],
        },
      ],
    },
    {
      name: 'QA Engineer',
      children: [
        {
          name: 'Jacobs Creek',
          events: [
            {
              id: 'h',
              type: 'stage',
              newStage: 'Offer',
              offer: '50000',
              startDateMillis: new DateTime.utc(2022, 3, 14, 18, 0, 0).toMillis(),
            },
          ],
        },
      ],
    },
    {
      name: 'Head Of Product',
      children: [
        {
          name: 'Dave Cranwell3',
          events: [
            {
              id: 'i',
              type: 'stage',
              newStage: 'signed',
              startDateMillis: new DateTime.utc(2022, 4, 2, 12, 0, 0).toMillis(),
            },
          ],
        },
      ],
    },
  ],
}

export default defaultEvents

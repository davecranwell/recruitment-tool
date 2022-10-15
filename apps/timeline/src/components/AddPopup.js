import classNames from 'classnames'
import { useForm } from 'react-hook-form'

export default function AddPopup({ open, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const doSubmit = (data, e) => {
    reset()
    onSubmit(data)
  }

  // {
  //   group: 'Dave Cranwell',
  //   id: 'e',
  //   type: 'comment',
  //   newStage: 'foooooooo',
  //   offer: '50000',
  //   startDateMillis: new DateTime.utc(2022, 4, 1, 18, 0, 0).toMillis(),
  //   endDateMillis: new DateTime.utc(2022, 4, 1, 19, 30, 0).toMillis(),
  // },

  return (
    <div className={classNames('add-popup', `add-popup--open${open}`)}>
      <form onSubmit={handleSubmit(doSubmit)}>
        <ul className={'formlist'}>
          <li>
            <input
              type="datetime-local"
              {...register('eventDateTime', { required: true })}
            />
            {errors.group && <div>This field is required</div>}
          </li>

          <li>
            <input
              placeholder="candidate name"
              {...register('group', { required: true })}
            />
            {errors.group && <div>This field is required</div>}
          </li>

          <li>
            <select {...register('type', { required: true })}>
              <option value="stage">stage</option>
              <option value="comment">comment</option>
            </select>
            {errors.type && <div>This field is required</div>}
          </li>

          <li>
            <input
              placeholder="new stage"
              {...register('newStage', { required: true })}
            />
            {errors.exampleRequired && <div>This field is required</div>}
          </li>

          <li>
            <input type="submit" />
          </li>
        </ul>
      </form>
    </div>
  )
}

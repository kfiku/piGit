import { ADD_REPO/*, DELETE_REPO, EDIT_REPO, COMPLETE_REPO, COMPLETE_ALL, CLEAR_COMPLETED*/ } from '../constants/ActionTypes'

const initialState = [

];

export default function repos(state = initialState, action) {
  console.log(action);
  switch (action.type) {
    case ADD_REPO:
      return [
        {
          id: state.reduce((maxId, repo) => Math.max(repo.id, maxId), -1) + 1,
          dir: action.dir
        },
        ...state
      ]

    // case DELETE_REPO:
    //   return state.filter(repo =>
    //     repo.id !== action.id
    //   )

    // case EDIT_REPO:
    //   return state.map(repo =>
    //     repo.id === action.id ?
    //       { ...repo, text: action.text } :
    //       repo
    //   )

    // case COMPLETE_REPO:
    //   return state.map(repo =>
    //     repo.id === action.id ?
    //       { ...repo, completed: !repo.completed } :
    //       repo
    //   )

    // case COMPLETE_ALL:
    //   const areAllMarked = state.every(repo => repo.completed)
    //   return state.map(repo => ({
    //     ...repo,
    //     completed: !areAllMarked
    //   }))

    // case CLEAR_COMPLETED:
    //   return state.filter(repo => repo.completed === false)

    default:
      return state
  }
}

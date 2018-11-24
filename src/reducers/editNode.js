const initialState = [];
  
export default function nodes(state = initialState, action) {
  switch (action.type){
    case 'START_EDIT_NODE': 
      return [
        action.node
      ];
    case 'STOP_EDIT_NODE':
      return [];
    default:
    return state;
  }
}
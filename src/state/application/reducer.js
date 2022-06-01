
const initialState = {
    myProjects: [],
    currentProjects: null,
    gridIsActive:false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'addingProject':

            const payl = action.payload;
            let paylArr = [...state.myProjects,payl ]
            return { ...state, myProjects: paylArr }

        case 'removeProject':

            const result = state.myProjects.filter(x => x.key !== action.payload);
            state = { ...state, myProjects: result }
          
            return state

        case 'addProjectToCanvas':

            const project = state.myProjects.filter(x => x.key === action.payload);

            return { ...state, currentProjects: project[0] }

        case 'resetCurrentProject':

            return { ...state, currentProjects: action.payload }

            case 'setActiveGrid':

                return { ...state, gridIsActive: action.payload }

        default:
            return state;
    }
};

export default reducer
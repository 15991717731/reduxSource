/*
 * @Author: your name
 * @Date: 2020-01-16 14:33:58
 * @LastEditTime : 2020-01-19 17:17:26
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \reduxSource\index.js
 */
window.onload = () => {

    const initState = {
        content: {
            text: '内容'
        },
        btn: {
            play: true,
            text: 'stop',
        }
    }



    const renderApp = (state) => {
        renderSpan(state.content.text);
        renderBtn(state.btn.text);
    }

    const renderSpan = (text) => {
        const $span = document.getElementsByClassName('span')[0];
        $span.innerHTML = text;
    }

    const renderBtn = (text) => {
        const $btn = document.getElementsByClassName('btn')[0];
        $btn.innerHTML = text;
    }

    // content的reducer  state为state.content
    let initContentState = {
        text: '内容',
    }
    const contentReducer = (state, action) => {

        if (!state) {
            state = initContentState
        }

        switch (action.type) {
            case 'PLAY':
                return state = {
                    text: '内容',
                }
            case 'STOP':
                return state = {
                    text: '停止啦',
                }
            default:
                return state;
        }
    }

    // play的reducer  state为stated.btn
    let initPlayState = {
        play: true,
        text: 'stop',
    }
    const playReducer = (state, action) => {

        if (!state) {
            state = initPlayState;
        }

        switch (action.type) {
            case 'PLAY':
                return state = {
                    play: true,
                    text: 'stop',
                }
            case 'STOP':
                return state = {
                    play: false,
                    text: 'play',
                }
            default:
                return state;
        }
    }

    const combineReducers = (reducers) => {
        const reducerKeys = Object.keys(reducers);

        // 返回合并后新的reducer函数
        return function combinetion(state = {}, action) {
            const nextState = {};

            for (let i = 0, len = reducerKeys.length; i < len; i++) {
                const key = reducerKeys[i];
                const reducer = reducers[key];
                // 之前key的state
                const previousStateForKey = state[key];
                // 执行子reducer，获得新的state
                const nextStateForKey = reducer(previousStateForKey, action);

                nextState[key] = nextStateForKey;
            }
            // 得到了执行完所有子reducer之后的state
            return nextState;
        }
    }


    // // combineReducers函数用来将多个reducer合并为一个reducer
    // // 使用方法
    const reducer = combineReducers({
        content: contentReducer,
        btn: playReducer,
    })

    // const reducer = (state, action) => {
    //     switch (action.type) {
    //         case 'PLAY':
    //             return {
    //                 content: {
    //                     text: '内容'
    //                 },
    //                 btn: {
    //                     play: true,
    //                     text: 'stop',
    //                 }
    //             }
    //         case 'STOP':
    //             return {
    //                 content: {
    //                     text: '停止啦'
    //                 },
    //                 btn: {
    //                     play: false,
    //                     text: 'play',
    //                 }
    //             }
    //         default:
    //             return state;
    //     }
    // }

    // 定义createStore方法来管理全局状态
    const createSotre = (reducer) => {
        let state = initState;
        // 监听状态修改对象
        const listeners = [];

        // 获取数据
        const getState = () => state;

        // 提供dispatch方法，参数为action
        const dispatch = (action) => {
            // 修改状态
            state = reducer(state, action);
            // 调用监听
            listeners.forEach(listener => listener())
        };

        // 监听函数，参数为一个函数
        const subscribe = (listener) => {
            listeners.push(listener);
            return function unsubscribe() {
                const index = listeners.indexOf(listener);
                listeners.splice(index, 1);
            }
        };

        // 用不匹配任何type的action，来触发reducer，由于action.type不匹配，每个子reducer都会进入default，返回初始化的state
        dispatch({ type: Symbol() });
        return { getState, dispatch, subscribe };
    }

    const store = createSotre(reducer);

    renderApp(store.getState());

    store.subscribe(() => {
        let state = store.getState();
        renderApp(state);
    })
    
    const unsubscribe = store.subscribe(() => {
        let state = store.getState();
        console.log(state.content.text);
    })

    unsubscribe();

    // 点击btn改变span的html
    const $btn = document.getElementsByClassName('btn')[0];

    $btn.addEventListener('click', (e) => {

        if (!store.getState().btn.play) {
            return store.dispatch({ type: 'PLAY' })
        }

        return store.dispatch({ type: 'STOP' });

    })
}

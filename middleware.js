/*
 * @Author: your name
 * @Date: 2020-01-19 16:45:43
 * @LastEditTime : 2020-01-19 17:04:38
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \reduxSource\middleware.js
 */
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
    const subscribe = (listener) => { listeners.push(listener) };

    // 用不匹配任何type的action，来触发reducer，由于action.type不匹配，每个子reducer都会进入default，返回初始化的state
    dispatch({ type: Symbol() });
    return { getState, dispatch, subscribe };
}
const store = createSotre(reducer);
const exceptionMiddleware = (next) => {
    return (action) => {
        try {
            next(action);
        } catch (error) {
            console.error('error:', error);
        }
    }
}

const loggerMiddleware = (store) => {
    return (next) => {
        return (action) => {
            console.log('this state:', store.getState());
            console.log('action', action);
            next(action);
            console.log('next state', store.getState());
        }
    }
}

const timeMiddleware = (store) => (next) => (action) => {
    console.log('time:', new Date().getTime());
    next(action);
}

const applyMiddleware = function (...middleware) {
    // 返回一个重写createStore的方法
    return function rewriteCreateStoreFunc(oldCreateStore) {
        // 返回重写后新的createStore的方法
        return function newCreateStore(reducer, initState) {
            // 生成store
            const store = oldCreateStore(reducer, initState);
            // 给每个middleware传下store，相当于 const logger = loggerMiddleware(store)
            const chain = middlewares.map(middleware => nuddkeware(store));
            let dispatch = store.dispatch;
            // 实现exception(time(logger(dispatch)))
            chain.reverse().map(middleware => {
                dispatch = middleware(dispatch);
            })
            store.dispatch = dispatch;
            return store;
        }
    }
}

const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);
const newCreateStore = rewriteCreateStoreFunc(createSotre);
const store = newCreateStore(reducer, initState);

const next = store.dispatch;
const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
const time = timeMiddleware(store);
store.dispatch = exception(time(logger(next)));

store.dispatch({
    type: 'PLAY',
})
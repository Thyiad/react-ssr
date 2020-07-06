import React, { FC, useEffect } from 'react';
import { useRedux } from '@/hooks/useRedux';
import './index.scss';

const todo: React.FC<RoutePageProps> = () => {
    const { state, actions } = useRedux();
    useEffect(() => {
        setTimeout(() => {
            actions.global.setKeyValue('name', 'name1111111');
        }, 1500);
    }, []);
    console.log('in todo render..................');
    return (
        <div className="todo-page">
            <p>{state.name}</p>
            <p className="doing">doing item is : {state.doingItem}</p>
            <button
                onClick={() => {
                    actions.todo.setTodoList([...state.todoList, 'newToDo']);
                }}
            >
                click to add todo
            </button>
            <p className="todo-header">todoList is :</p>
            {state.todoList.map((item, index) => (
                <p key={item + index} className="todo-item">
                    {item}
                </p>
            ))}
        </div>
    );
};

export default todo;

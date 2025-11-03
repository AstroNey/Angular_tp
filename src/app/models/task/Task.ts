import {State} from '../state/State';

export interface Task {
    id: number;
    title: string;
    description: string;
    state: State;
}

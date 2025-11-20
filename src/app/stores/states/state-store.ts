import {computed, inject} from '@angular/core';
import {State} from '../../models/state/State';
import {patchState, signalStore, withComputed, withMethods, withProps, withState} from '@ngrx/signals';
import {StateService} from '../../services/state/state-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';
import {AuthService} from '../../services/auth/auth-service';

interface StatesState {
    states: State[];
    error: string | null;
    needToReload: boolean;
}

const initialState: StatesState = {
    states: [],
    error: null,
    needToReload: false
};

export const StateStore = signalStore(
    { providedIn: 'root' },
    withState<StatesState>(initialState),

    withProps(() => ({
        stateService: inject(StateService),
        authService: inject(AuthService),
    })),

    withMethods((store) => ({
        async loadStore() {
            store.stateService.getStates().subscribe(states => {
                patchState(store, { states: states, needToReload: false });
            });
        },
        updateStatesOrder(newStatesOrder: State[]): void {
            patchState(store, { states: [...newStatesOrder]});
        },
        async addState(state: State): Promise<void> {
            const response: State =  await lastValueFrom(
                store.stateService.createState(state)
            );
            patchState(store, (actState) => ({
                states: [...actState.states, response]
            }));
        },
        async deleteStateById(id: number): Promise<void> {
            await lastValueFrom(
                store.stateService.deleteState(id)
            )
            patchState(store, (actState) => ({
                states: actState.states.filter((s: State): boolean => s.id !== id)
            }));
        }
    })),

    withComputed((store) => ({
        stateColumns: computed((): string => store.states().length.toString()),
        patternStates: computed((): RegExp => {
            const states = store.states().map((s: State): string => s.id.toString());
            const patternString = `^(${states.join('|')})$`;
            return new RegExp(patternString);
        })
    })),
);

import {computed, inject} from '@angular/core';
import {State} from '../../models/state/State';
import {patchState, signalStore, withComputed, withMethods, withProps, withState} from '@ngrx/signals';
import {StateService} from '../../services/state/state-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';
import {AuthService} from '../../services/auth/auth-service';
import {UtilsService} from '../../services/utils/utils-service';

interface StatesState {
    states: State[];
    error: string | null;
}

const initialState: StatesState = {
    states: [],
    error: null
};

export const StateStore = signalStore(
    { providedIn: 'root' },
    withState<StatesState>(initialState),

    withProps(() => ({
        stateService: inject(StateService),
        authService: inject(AuthService),
        utilsService: inject(UtilsService),
    })),

    withMethods((store) => ({
        async loadStore() {
            store.stateService.getStates().subscribe(states => {
                const orderedStates: State[] = states.sort((a: State, b: State) => a.order - b.order);
                patchState(store, { states: orderedStates });
            });
        },
        async updateStatesOrder(newStatesOrder: State[]): Promise<void> {
            newStatesOrder.map((state: State): number => state.order = newStatesOrder.findIndex((s: State): boolean => s.id === state.id));
            await lastValueFrom(
                store.stateService.updateStatesOrder(newStatesOrder)
            );
            patchState(store, { states: [...newStatesOrder]});
        },
        async addState(state: State): Promise<void> {
            const response: State =  await lastValueFrom(
                store.stateService.createState(state)
            );
            store.states().forEach((s: State) => {
                if (s.order >= state.order) {
                    s.order += 1;
                }
            });
            patchState(store, (actState) => ({
                states: [...actState.states, response]
            }));
            store.states().sort((a: State, b: State) => a.order - b.order);
            this.updateStatesOrder(store.states());
            store.utilsService.handleSucces("State created successfully.");
        },
        async deleteStateById(id: number): Promise<void> {
            await lastValueFrom(
                store.stateService.deleteState(id)
            )
            patchState(store, (actState) => ({
                states: actState.states.filter((s: State): boolean => s.id !== id)
            }));
            store.utilsService.handleSucces("State deleted successfully.");
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

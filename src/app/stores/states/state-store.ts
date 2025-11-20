import {computed, effect, inject} from '@angular/core';
import {State} from '../../models/state/State';
import {patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState} from '@ngrx/signals';
import {StateService} from '../../services/state/state-service';
import {lastValueFrom} from 'rxjs/internal/lastValueFrom';

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
    })),

    withProps(({ stateService }) => ({
        _states: stateService.getStates(),
    })),

    withMethods((store) => ({
        reloadStore(): void {
            store._states.reload();
            console.log('States reloaded');
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
        isAlreadyInitialized: computed((): boolean => store.states().length != 0),
        patternStates: computed((): RegExp => {
            const states = store.states().map((s: State): string => s.id.toString());
            const patternString = `^(${states.join('|')})$`;
            return new RegExp(patternString);
        })
    })),

    withHooks(store => ({
        onInit(): void {
            effect((): void => {
                const states: State[] = store._states.value();
                if (states) {
                    patchState(store, { states: states });
                }
            });
        }
    }))
);

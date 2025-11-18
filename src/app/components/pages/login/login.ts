import {Component, inject, signal, WritableSignal} from '@angular/core';
import {User} from '../../../models/user/user';
import {
    Field, FieldPath,
    FieldState,
    FieldTree,
    form,
    maxLength,
    minLength,
    pattern,
    required,
    submit
} from '@angular/forms/signals';
import Role from '../../../models/enums/Role';
import {AuthService} from '../../../services/auth/auth-service';
import {AuthResponse} from '../../../models/httpModels/AuthResponse';
import {Router} from '@angular/router';
import {FormErrors} from '../../tools/forms/form-errors/form-errors';

@Component({
  selector: 'app-login',
    imports: [
        Field,
        FormErrors
    ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    #authService: AuthService = inject(AuthService);
    #router: Router = inject(Router);

    readonly roles: Role[] = Object.values(Role);
    protected readonly Role = Role;

    protected isRegisterForm: WritableSignal<boolean> = signal<boolean>(false);

    userModel: WritableSignal<User> = signal<User>({
        id: 0,
        username: '',
        password: '',
        role: Role.UNKNOWN,
    });

    userForm: FieldTree<User> = form(this.userModel, (path: FieldPath<User>): void => {
        required(path.username, { message: "Username is required." });
        minLength(path.username, 3, { message: "Username must be at least 3 characters long."});
        maxLength(path.username, 20, { message: "Username cannot exceed 20 characters."});

        required(path.password, { message: "Password is required." });
        minLength(path.password, 6, { message: "Password must be at least 6 characters long."});
        maxLength(path.password, 50, { message: "Password cannot exceed 50 characters."});

        if (this.isRegisterForm()) {
            required(path.role, { message: "Role is required." });
            pattern(path.role, /^(ADMIN|USER)$/, { message: "Role must be either ADMIN or USER." });
        }
    });

    protected showErrors(field: FieldState<string,  string>): boolean {
        return field.touched() && field.errors().length > 0;
    }

    protected onSubmit(event: SubmitEvent): void {
        try {
            submit(this.userForm, async (form: FieldTree<User>): Promise<void> => {
                if (this.isRegisterForm()) {
                    this.#authService.register(form().value()).subscribe({
                        next: (res: AuthResponse) => {
                            this.#router.navigate(['/tasks']);
                        }
                    });
                }
                else {
                    this.#authService.login(form().value()).subscribe({
                        next: async (res: AuthResponse) => {
                            await this.#router.navigate(['/tasks']);
                        }
                    });
                }
            });
            event.preventDefault();
        } catch (e) {
            console.error("Error submitting login form:", e);
        }
    }

    protected changeFormStateToRegister(): void {
        this.isRegisterForm.set(!this.isRegisterForm());
        this.userForm().reset();
    }

}

import {Component, inject, signal} from '@angular/core';
import {User} from '../../../models/user/user';
import {Field, FieldState, form, maxLength, minLength, pattern, required, submit} from '@angular/forms/signals';
import Role from '../../../models/enums/Role';
import {AuthService} from '../../../services/auth/auth-service';
import {AuthResponse} from '../../../models/httpModels/AuthResponse';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
    imports: [
        Field
    ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    #authService = inject(AuthService);
    #router = inject(Router);

    readonly roles: Role[] = Object.values(Role);
    protected readonly Role = Role;

    protected isRegisterForm = signal<boolean>(false);

    userModel = signal<User>({
        id: 0,
        username: '',
        password: '',
        role: Role.UNKNOWN,
    });

    userForm = form(this.userModel, (path) => {
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

    protected onSubmit(event: SubmitEvent) {
        try {
            submit(this.userForm, async (form) => {
                if (this.isRegisterForm()) {
                    this.#authService.register(form().value()).subscribe({
                        next: (res: AuthResponse) => {
                            this.#router.navigate(['/tasks']);
                        }
                    });
                }
                else {
                    this.#authService.login(form().value()).subscribe({
                        next: (res: AuthResponse) => {
                            this.#router.navigate(['/tasks']);
                        }
                    });
                }
                event.preventDefault();
            });
            event.preventDefault();
        } catch (e) {
            console.error("Error submitting login form:", e);
        }
    }

    protected changeFormStateToRegister() {
        this.isRegisterForm.set(!this.isRegisterForm());
        this.userForm().reset();
    }

}

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validatorSenhaForte(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regexSenhaForte = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[0-9a-zA-Z\W_]{8,}$/;
    const value = control.value ?? '';
    const valid = regexSenhaForte.test(value);
    return valid ? null : { strongPassword: true };
  };
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  // Esse validator deve ser aplicado no FormGroup
  const group = control as any; // ou as FormGroup se você importar
  const passwordControl = group.get?.('password');
  const confirmPasswordControl = group.get?.('confirmPassword');

  if (!passwordControl || !confirmPasswordControl) return null;

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  // opcional: não acusa "notSame" enquanto confirmPassword estiver vazio
  if (!confirmPassword) {
    removeControlError(confirmPasswordControl, 'notSame');
    return null;
  }

  if (password !== confirmPassword) {
    addControlError(confirmPasswordControl, 'notSame');
    return { notSame: true }; // erro no nível do grupo (opcional, mas útil)
  }

  removeControlError(confirmPasswordControl, 'notSame');
  return null;
};

// helpers para não apagar outros erros existentes
function addControlError(ctrl: AbstractControl, errorKey: string) {
  const errors = ctrl.errors ?? {};
  if (!errors[errorKey]) {
    ctrl.setErrors({ ...errors, [errorKey]: true });
  }
}

function removeControlError(ctrl: AbstractControl, errorKey: string) {
  const errors = ctrl.errors;
  if (!errors || !errors[errorKey]) return;

  const { [errorKey]: _, ...rest } = errors;
  ctrl.setErrors(Object.keys(rest).length ? rest : null);
}

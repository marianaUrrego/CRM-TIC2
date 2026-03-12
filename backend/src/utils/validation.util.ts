// Utilidades de validación para seguridad

/**
 * Valida que la contraseña cumpla con requisitos de seguridad:
 * - Mínimo 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula  
 * - Al menos un número
 * - Al menos un carácter especial
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  // Regex para validar contraseña segura
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
    };
  }

  return { isValid: true };
}

/**
 * Valida que el nombre solo contenga letras y espacios
 * Acepta letras con acentos y ñ/Ñ
 */
export function validateName(name: string): { isValid: boolean; message?: string } {
  if (!name) {
    return { isValid: false, message: 'Name is required' };
  }

  // Regex para validar solo letras y espacios (incluye acentos y ñ)
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  
  if (!nameRegex.test(name.trim())) {
    return {
      isValid: false,
      message: 'Name must contain only letters'
    };
  }

  // Validar que no esté vacío después de trim
  if (name.trim().length === 0) {
    return {
      isValid: false,
      message: 'Name cannot be empty'
    };
  }

  return { isValid: true };
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email) {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.trim())) {
    return {
      isValid: false,
      message: 'Invalid email format'
    };
  }

  return { isValid: true };
}


export const validLetter = new RegExp('^[a-zA-Z ]+$');
export const validEmail = new RegExp('[a-zA-Z0-9]+@(gmail|yahoo|outlook)+.(com)$');

//Password validation
export const passwordDigits = new RegExp('[0-9]');
export const passwordLowercase = new RegExp('[a-z]');
export const passwordUppercase = new RegExp('[A-Z]');
export const passwordCharacter = new RegExp('[!@#$%^&*()+=-]');
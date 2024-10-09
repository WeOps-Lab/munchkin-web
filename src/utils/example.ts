function greet(name: string) {
  return `Hello, ${name}!`; 
}
  
// Intentionally causing a type error
const name: number = 'World';
console.log(greet(name));
  
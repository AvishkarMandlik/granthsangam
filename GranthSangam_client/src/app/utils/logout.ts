export function logout(): void {
  localStorage.removeItem('user');
  window.location.href = '/login'; 
}

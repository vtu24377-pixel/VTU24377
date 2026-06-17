export async function fetchNotifications() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaHJ1dGhpbG11cnVnYW5AZ21haWwuY29tIiwiZXhwIjoxNzgxNjgxNDcwLCJpYXQiOjE3ODE2ODA1NzAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0OWJlMzVlYy0wZDViLTRjNmQtYTZjMS03NTY5ZGNiN2VlY2EiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJzaHJ1dGhpIG0iLCJzdWIiOiI3YmMwN2EyMC03OGI0LTQwNjktOWExYi1kY2U0ZjMzZmFlYjMifSwiZW1haWwiOiJzaHJ1dGhpbG11cnVnYW5AZ21haWwuY29tIiwibmFtZSI6InNocnV0aGkgbSIsInJvbGxObyI6InZ0dTI0Mzc3IiwiYWNjZXNzQ29kZSI6Imp1RnBodiIsImNsaWVudElEIjoiN2JjMDdhMjAtNzhiNC00MDY5LTlhMWItZGNlNGYzM2ZhZWIzIiwiY2xpZW50U2VjcmV0IjoiemVKcWtFdEVZSEJDRkRyYSJ9.PZVIkaNAekdfP1ESl8nuk8mBan5cpbe2WIJFHTbUP4Q";

  const response = await fetch(
    "http://4.224.186.213/evaluation-service/notifications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  return data;
}
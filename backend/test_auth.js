
async function test() {
  console.log("--- Testing Registration ---");
  const regRes = await fetch("http://127.0.0.1:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: "user"
    })
  });
  const regData = await regRes.text();
  console.log("Register:", regRes.status, regData);

  console.log("--- Testing Login ---");
  const loginRes = await fetch("http://127.0.0.1:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123"
    })
  });
  const loginData = await loginRes.text();
  console.log("Login:", loginRes.status, loginData);
}

test();

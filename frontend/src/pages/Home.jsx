import API from "../api/axios";

export default function Home() {
  const testProtected = async () => {
    try {
      const res = await API.get("/auth/protected");
      console.log(res.data);
    } catch (err) {
      console.error(err.response?.data);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={testProtected}>
        Test Protected Route
      </button>
    </div>
  );
}

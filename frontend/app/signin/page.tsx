"use client";
import { createSession } from "@/services/authApi";
import { Container, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Signin() {
  const router = useRouter();

  const handleSignin = async () => {
    try {
      await createSession();
      router.push("/");
    } catch (error: any) {
      switch (error.response.data.code) {
        case "COOKIE_DISABLED":
          console.error("Unauthorized.", error);
          return;
        default:
          console.error("An error occurred.", error);
          return;
      }
    }
  }
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Button variant="contained" onClick={handleSignin}>
        Sign in
      </Button>
    </Container>
  );
}

//import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <>
      <Head>
        <title>Login · Privy</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet" />
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-black flex-1 p-6 justify-center items-center">
          <div>
            <div className="flex justify-center text-center text-white text-bold font-mono text-4xl mb-6">
              RTS
            </div>
            <div className="flex justify-center text-center">
              <button
                className="mt-6 bg-white text-black hover:bg-black hover:text-white hover:border-white border-2 border-transparent py-3 px-6 rounded-lg font-mono transition-colors duration-600"
                onClick={login}
              >
                login
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

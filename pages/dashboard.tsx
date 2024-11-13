import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Head from "next/head";
//import Image from 'next/image';

import P5Canvas from './p5Canvas';

const DashboardPage = () => {
  const router = useRouter();
  const {
    ready,
    authenticated,
    //user,
    //logout,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  useEffect(() => {
    const setVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);

    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <>
      <Head>
        <title>reward.wtf</title>
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono&display=swap" rel="stylesheet" />
        <style>{`
          body {
            overflow: hidden;
            background: black;
          }
        `}</style>
      </Head>

      <main className="flex bg-black font-mono min-h-screen">
        {ready && authenticated ? (
          <div className="w-full h-screen flex justify-center items-center">
            <div 
              className="relative bg-black"
              style={{
                width: 'min(600px, 100vw)',
                height: 'min(600px, 100vw)',
              }}
            >
              <P5Canvas />
            </div>
          </div>
        ) : null}
      </main>
    </>
  );
};

export default DashboardPage;

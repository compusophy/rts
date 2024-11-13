import React from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Update the import path and component name
const WebGLCanvas = dynamic(() => import('../components/p5Canvas'), {
  ssr: false
});

const WebGLPage: NextPage = () => {
  return <WebGLCanvas />;
};

export default WebGLPage;

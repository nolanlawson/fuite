import waitForLocalhost from 'wait-for-localhost';

before(async () => {
  console.log('Waiting for localhost:3000')
  await waitForLocalhost({ port: 3000 });
  console.log('localhost:3000 is up')
})
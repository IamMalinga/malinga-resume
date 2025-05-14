import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = 'G-6QPH0D6KKP'; // Replace with your GA Measurement ID

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: 'pageview', page: url });
};

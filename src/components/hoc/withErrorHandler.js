import React, {useState,useEffect} from 'react';

import ErrorModal from './../UI/ErrorModal';

const withErrorHandler = (WrappedComponent, axios) => {

  return props => {


    const [error, setError] = useState(null);

    const reqInterceptor = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });
    const resInterceptor = axios.interceptors.response.use(
      res => res,
      err => {
        setError(err.toString());
      }
    );
  
    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqInterceptor);
        axios.interceptors.response.eject(resInterceptor);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reqInterceptor, resInterceptor]);

    return (      
      <>    
      {error && <ErrorModal onClose={() => setError(null)}>{error.toString()}</ErrorModal>}
        <WrappedComponent setError ={setError} {...props} />
      </>
    );
  };
};


export default withErrorHandler;
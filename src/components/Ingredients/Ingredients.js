import React, { useState, useEffect, useCallback } from 'react';

import axios from '../../axios';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import withErrorHandler from './../hoc/withErrorHandler';

const Ingredients = (props) => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    axios.get('https://simple-firebase-storage.firebaseio.com/ingredients1.json')
      .then(responseData => {
        const loadedIngredients = [];
        Object.keys(responseData.data).map(key => loadedIngredients.push({
          id: key,
          title: responseData.data[key].title,
          amount: responseData.data[key].amount
        }));
        setUserIngredients(loadedIngredients);
      }) //TODO: 1
    // .catch(error => {      
    //   props.setError(error);})
    // .finally(() => {
    //   setIsLoading(false);
    // });

  }, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS ', userIngredients);
  }, [userIngredients]);


  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    axios.post('/ingredients1', ingredient)
      .then(response => {
        return response.json();
      })
      .then(responseData => {
        console.log('responseData', responseData);
        setIsLoading(false);
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.data.name, ...ingredient }
        ]);
      }) // TODO: 2 This part could/should be handled by Error Boundaries yet see the effect of catch by uncommenting the code below
    // .catch(error => {      
    //   props.setError(error);})
    // .finally(() => {
    //   setIsLoading(false);
    // });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    axios.delete(`/ingredients1/${ingredientId}.jon`)
      .then(response => {
        console.log('exectues!');
        return response.json();
      })
      .then(response => {
        console.log('remove response', response);
        setUserIngredients(prevIngredients =>
          prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
        );
      }) // TODO: 3
    // .catch(error => {      
    //   props.setError('Something went wrong!');
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });
  };


  return (
    <div className="App">

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default withErrorHandler(Ingredients, axios);

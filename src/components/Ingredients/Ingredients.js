import React, { useState, useEffect, useCallback } from 'react';

import axios from '../../axios';
import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';
import withErrorHandler from './../hoc/withErrorHandler';

const Ingredients = (props) => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);  

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    axios.post('/ingredients.json',ingredient)  
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        setUserIngredients(prevIngredients => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient }
        ]);
      });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    axios.delete( `/ingredients/${ingredientId}.jon`) 
    .then(response => {
      setIsLoading(false);
      setUserIngredients(prevIngredients =>
        prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      );
    }).catch(error => {
      props.setError('Something went wrong!');
      setIsLoading(false);
    });
  };


  return (
    <div className="App">      

      <IngredientForm
        onAddIngredient={addIngredientHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default withErrorHandler(Ingredients, axios);

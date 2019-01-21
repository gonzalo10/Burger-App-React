import React from 'react';

import classes from './Burger.css';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient';

const burger = (props) => {
    //####################################

    //REPASAR como funciona esta funcion
    
    //####################################
    let transformedIngredients = Object.keys(props.ingredients)
            .map(igKey => {
                return [...Array(props.ingredients[igKey])].map((_, i) => {
                    return (
                        <BurgerIngredient key ={igKey + i} type = {igKey} />
                    );
                })
            })
            .reduce((arr, el) => {
                return arr.concat(el)
            }, []);
    //Usando el reduce lo que hacemos es hacer el array flat para asi saber si esta vacio o lleno
    // antes no podiamos porque aunque estuviera vacio tenia dos niveles asi que el primer nivel siempre nos salia con len = 4
    
    if(transformedIngredients.length === 0){
        transformedIngredients = <p>Please start adding ingredients!!</p>
    }
    
    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top" />
            {transformedIngredients}
            <BurgerIngredient type="bread-bottom" />
        </div>
    );
};

export default burger;
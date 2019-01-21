import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';

const INGREDIENTES_PRICES = {
        salad:0.5,
        cheese: 0.4,
        meat: 1.3,
        bacon: 0.6,
}

class BurgerBuilder extends Component {
    //constructor(props) {
    //   super(props);
    //   this.state= {}
    // }
    state = {
        ingredients : {
            salad: 0,
            bacon: 0,
            cheese: 0,
            meat: 0,
        },
        totalPrice: 4,
        purchasable: false,
        purchasing:false,
  }

  updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey] //aqui lo que hacemos es accader a un property in the ingredients object
            })
            .reduce((sum,el) => {
                return sum + el
            }, 0);

        this.setState( {purchasable : sum > 0}) //esto es verdader o falso y es verdadero si tenemos mas de un 1 ingrediente
  }

  addIngredientHandler = (type) => {
      const oldCount = this.state.ingredients[type];
      const updatedCounted = oldCount + 1;
      const updatedIngredients = {
            ...this.state.ingredients
      };
      updatedIngredients[type] = updatedCounted;

      const priceAddition = INGREDIENTES_PRICES[type];
      const oldPrice = this.state.totalPrice;
      const newPrice = oldPrice + priceAddition;

      this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
      this.updatePurchaseState(updatedIngredients);
      
  }
  removeIngredientHandler = (type) => {
    const oldCount = this.state.ingredients[type];
    if(oldCount <= 0) {
        return; 
    }
    const updatedCounted = oldCount - 1;
    const updatedIngredients = {
          ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCounted;

    const priceDeduction = INGREDIENTES_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({totalPrice: newPrice, ingredients: updatedIngredients});
    this.updatePurchaseState(updatedIngredients);

  }

  purchaseHandler = () => {
      this.setState({purchasing:true })
  }

  purchaseCancelHandler = () => {
      this.setState({purchasing: false});
  }

  purchaseContinueHandler = () => {
        alert('You continue!');
  }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    <OrderSummary 
                        ingredients={this.state.ingredients}
                        price={this.state.totalPrice}
                        purchaseCancelled={this.purchaseCancelHandler}
                        purchaseContinued={this.purchaseContinueHandler}/>
                </Modal>
                <Burger ingredients = {this.state.ingredients}/>
                <BuildControls 
                    ingredientAdded={this.addIngredientHandler}
                    ingredientRemove={this.removeIngredientHandler}
                    purchasable = {this.state.purchasable}
                    disabled = {disabledInfo}
                    ordered = {this.purchaseHandler}
                    price={this.state.totalPrice}
                    />
            </Aux>
        );
    }
}

export default BurgerBuilder;
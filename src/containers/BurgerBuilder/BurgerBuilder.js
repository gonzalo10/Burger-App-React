import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorhandler/withErrorHandler';

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
        loading: false,
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
        // alert('You continue!');
        this.setState({loading: true});
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.price,
            customer: {
                name: 'Gonzalo',
                address: {
                    street: 'test street',
                    zipCode: '09090',
                    country: 'Spain'
                },
                email: 'test@tes.com',
            },
            deliveryMode: 'fastes'
        }
        axios.post('/orders.json', order)
            .then(response => {this.setState({loading:false, purchasing: false});})
            .catch(error => {this.setState({loading:false, purchasing: false});});
  }

    render() {
        const disabledInfo = {
            ...this.state.ingredients
        };
        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = <OrderSummary 
                            ingredients={this.state.ingredients}
                            price={this.state.totalPrice}
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler}/>
        if(this.state.loading){
            orderSummary = <Spinner />
        }
        return(
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
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

export default withErrorHandler(BurgerBuilder, axios);
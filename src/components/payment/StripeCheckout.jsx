import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "../../api/paymentApi";

const StripeCheckout = ({ amount, appointmentId }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await createPaymentIntent({
      amount,
      appointmentId
    });

    const result = await stripe.confirmCardPayment(
      data.clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      }
    );

    if (result.error) {
      alert(result.error.message);
    } else {
      alert("Payment successful 🎉");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-4 border rounded-md bg-white" />
      <button className="bg-emerald-500 px-6 py-2 rounded-md font-semibold">
        Pay ₹{amount}
      </button>
    </form>
  );
};

export default StripeCheckout;

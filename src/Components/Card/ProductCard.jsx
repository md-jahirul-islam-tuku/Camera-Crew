import React, { useContext } from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { AuthContext } from '../../Context/AuthProvider';
import { GeneralContext } from '../../Context/GeneralProvider';
import Swal from 'sweetalert2';

const ProductCard = ({ product, handleOrders }) => {
  const { _id, image, productName, location, resalePrice, originalPrice, usesYears, category, userName, mobile, condition, badge } = product;
  const { user } = useContext(AuthContext);
  const { dbUser, bookings } = useContext(GeneralContext);

  const booked = bookings.filter(book => book.productId === _id && book.userEmail === user?.email)
  const id = booked[0]?.productId;
  const email = booked[0]?.userEmail;

  const handleDisableButton =()=>{
    Swal.fire({
      icon: 'info',
      title: "Booking active only for Buyer",
      text: "Please login as a buyer",
      showConfirmButton: false,
    })
  }
  return (
    <div className="card card-compact bg-white shadow-xl">
      <figure><img src={image} alt="Shoes" className='h-56 px-2' /></figure>
      <hr />
      <div className="card-body text-left gap-0">
        <h2 className="text-base font-semibold text-primary">{productName}</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Category:</span> {category}</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Uses Years:</span> {usesYears} yrs.</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Condition:</span> {condition}</h2>
        <h2 className="text-base font-semibold flex items-center"><span className='text-primary mr-1'>Seller:</span> {userName}{badge && <CheckBadgeIcon className="h-5 w-5 ml-1 text-blue-500 animate-bounce" />}</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Location:</span> {location}</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Contact No:</span> {mobile}</h2>
        <h2 className="text-base font-semibold"><span className='text-primary'>Original Price:</span> {originalPrice} Tk.</h2>
        <h2 className="text-xl font-semibold text-primary">Tk. {resalePrice}</h2>
        <div className="card-actions justify-end mt-3">
          {
            dbUser?.role === "Buyer" ? <button onClick={() => handleOrders(product)} className={`btn btn-primary btn-sm text-white ${id === _id && user?.email === email && 'btn-disabled bg-blue-200'}`}>
              Book Now
            </button> : <div><button onClick={handleDisableButton} className='btn btn-sm text-white btn-primary'>
              Book Now
            </button></div>
          }
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Context/AuthProvider';
import LoadingSpinner from '../../Spinner/LoadingSpinner';

const MyProducts = () => {
  const { user, loading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(true)
  useEffect(() => {
    fetch(`https://y-mauve-alpha.vercel.app/products/${user?.email}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setRefresh(!refresh)
      })
  }, [user?.email, refresh])

  const handleDelete = product => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-error text-white mr-2'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert Dr. ${product?.productName}`,
      imageUrl: `${product?.image}`,
      imageWidth: 350,
      imageHeight: 350,
      imageAlt: 'Product image',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://y-mauve-alpha.vercel.app/products/${product?._id}`, {
          method: 'DELETE',
          headers: {
            authorization: `Bearer ${localStorage.getItem('cameraCrew-token')}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data?.deletedCount) {
              swalWithBootstrapButtons.fire(
                'Deleted!',
                `${product?.name} has been deleted.`,
                'success'
              )
            }
          })

      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your imaginary doctor is safe :)',
          'error'
        )
      }
    })
  }
  const handleAdvertisement = product => {
    fetch(`https://y-mauve-alpha.vercel.app/products/${product?._id}`, {
      method: 'PUT',
      headers: {
        authorization: `Bearer ${localStorage.getItem('cameraCrew-token')}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.modifiedCount) {
          Swal.fire({
            icon: 'success',
            imageUrl: `${product?.image}`,
            imageWidth: 350,
            imageHeight: 350,
            imageAlt: 'Product image',
            title: 'To Advertisement Successfully',
            text: `${product?.productName}`,
            showConfirmButton: true,
          })
        }
      })
      .catch(err => console.error(err))
  }

  return (
    <div className='min-h-[100vh] bg-gray-200 font-semibold text-primary'>
      {loading && <LoadingSpinner />}
      <h1 className='text-3xl py-5'>{user?.displayName} your total products: {products.length}</h1>
      <div className="overflow-x-auto mx-20">
        <table className="table w-full table-normal">
          <thead>
            <tr>
              <th></th>
              <th></th>
              <th>Price</th>
              <th>Status</th>
              <th>Advertisement</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              products.map((product, i) =>
                <tr key={product._id}>
                  <th>{i + 1}</th>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                          <img src={product.image} alt="Avatar Tailwind CSS Component" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.productName}</div>
                        <div className="text-sm opacity-50">{product.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className='text-lg'>Tk. {product.resalePrice}</td>
                  <td className='text-lg'>Available</td>
                  <td>{product.advertisement ? <p className='text-lg text-green-600'>Advertised</p> : <button onClick={() => handleAdvertisement(product)} className='btn btn-xs font-semibold text-white btn-primary'>Send to Adv</button>}</td>
                  <td><button onClick={() => handleDelete(product)} className='btn btn-xs font-semibold text-white btn-error'>Delete</button></td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyProducts;
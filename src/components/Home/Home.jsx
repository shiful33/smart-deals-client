import React from 'react';
import LatestProducts from '../LatestProducts/LatestProducts';
import Footer from '../Footer/Footer';
import Hero from '../Hero/Hero';


const latestProductsPromise = fetch('http://localhost:5000/latest-products')
.then(res => res.json());


const Home = () => {
    return (
        <div>
            <Hero />
            <LatestProducts latestProductsPromise={latestProductsPromise}></LatestProducts>
            <Footer/>
        </div>
    );
};

export default Home;
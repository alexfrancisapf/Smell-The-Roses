import defaultImage from '../assets/mount-everest.jpeg';
import parkImage from '../assets/park.jpg';
import reserveImage from '../assets/reserve.jpg';
import restaurantImage from '../assets/restaurant.jpg';
import riverImage from '../assets/river.jpg';
import golfImage from '../assets/golf.jpg';
import climbingImage from '../assets/climbing.jpg';
import amusementImage from '../assets/amusement.jpg';
import zooImage from '../assets/zoo.jpg';
import aquariumImage from '../assets/aquarium.jpg';
import sportsImage from '../assets/sports.jpg';
import artImage from '../assets/art.jpg';

/**
 * @param {string[]} categories - An array of category strings
 * @returns {string} - The path to the corresponding image
 */
export const getImage = (categories) => {
    
    const categoryImages = {
        park: parkImage,
        reserve: reserveImage,
        restaurant: restaurantImage,
        river: riverImage,
        golf: golfImage,
        climbing: climbingImage,
        theme: amusementImage,
        zoo: zooImage,
        aquarium: aquariumImage,
        sports: sportsImage,
        art: artImage
    };
    // Priority order for images
    const priorityOrder = ['aquarium', 'zoo', 'climbing', 'golf', 'art', 'theme', 'river', 'reserve', 'restaurant', 'sports', 'park'];
    const foundCategory = priorityOrder.find(priorityCat => 
        categories.some(cat => cat.split(' ')[0] === priorityCat) && categoryImages[priorityCat]
    );
    return categoryImages[foundCategory] || defaultImage;
};

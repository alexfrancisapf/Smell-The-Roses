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
import museumImage from '../assets/museum.jpg';
import historicImage from '../assets/historic.jpg';
import caveImage from '../assets/cave.jpg';
import forestImage from '../assets/forest.jpg';
import waterfallImage from '../assets/waterfall.jpg';
import beachImage from '../assets/beach.jpg';
import lakeImage from '../assets/lake.jpg';

/**
 * @param {string[]} categories - An array of category strings
 * @returns {string} - The path to the corresponding image
 */
export const getImage = (categories) => {
    
    const categoryImages = {
        park: parkImage,
        nature: reserveImage,
        restaurant: restaurantImage,
        river: riverImage,
        golf: golfImage,
        climbing: climbingImage,
        theme: amusementImage,
        zoo: zooImage,
        aquarium: aquariumImage,
        sports: sportsImage,
        art: artImage,
        museum: museumImage,
        historic: historicImage,
        cave: caveImage,
        forest: forestImage,
        waterfall: waterfallImage,
        beach: beachImage,
        lake: lakeImage
    };
    // Priority order for images
    const priorityOrder = ['aquarium', 'zoo', 'climbing', 'museum', 'historic', 'golf', 'art', 'theme', 'beach', 'cave', 
                            'waterfall', 'forest', 'river', 'lake', 'nature', 'restaurant', 'sports', 'park'];
    const foundCategory = priorityOrder.find(priorityCat => 
        categories.some(cat => cat.split(' ')[0] === priorityCat) && categoryImages[priorityCat]
    );
    return categoryImages[foundCategory] || defaultImage;
};

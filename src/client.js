import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId:'wdhbb0hd',
    dataset:'production',
    apiVersion:'2022-10-28',
    useCdn:true,
    token:'skHItib6uHVHM2wLfQa47VV7XGi3GJVOr1lGXNt6IQeOsgEvZ0DdiT8OBGQHxHgUFY03ldP6UK6JzLqtKD4IHzFofihYrdy4PFnqeHNvrugZ0Yc1j1KpojcmIKVrnA6yD8vZEfaFTUATtv003oJ0tT1YKmv7gvKR1PuFK4CUOTTpNhTR8nsv'
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
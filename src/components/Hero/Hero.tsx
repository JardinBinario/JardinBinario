import React, { useEffect, useState } from 'react';
import { Flexbox } from '../lib/Flexbox';
import heroStyles from './Hero.module.css';
import { HeroHeading } from './HeroHeading';
import { useHero } from '@/hooks/useHero';
import { Image } from '@/types/sharedTypes';
import { ApolloError } from '@apollo/client';
import { AiImageSwiper } from './AiImageSwiper';
import { AiImagePrompt } from './AiImagePrompt';
import { Spinner } from '../Spinner';

interface HeroProps {
    imagesLoading: boolean;
    imagesError: ApolloError | undefined;
    data: {
        getAllImagesOfDay: Image[];
    };
}

export const Hero = ({ imagesLoading, imagesError, data }: HeroProps) => {
    const { submitting, formik, image } = useHero();
    const images = data?.getAllImagesOfDay;
        // move this to context maybe?
    const [width, setWidth] = useState<number>(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const isMobile = width <= 768;
    return (
        <Flexbox
            alignItems='center'
            justifyContent={isMobile ? 'start' : 'space-between'}
            extraClass={heroStyles.container}
            flexDirection={isMobile ? 'column' : 'row'}
        >
            <HeroHeading isMobile={isMobile} title='Trae tus ideas, cultivaremos la solución.' />
            <Flexbox
                justifyContent={isMobile ? 'center' : 'space-around'}
                extraClass='bg-slate-900 h-[70%] md:h-full w-[100%] md:w-[60%]'
                alignItems={isMobile ? image ? 'center' : 'start' : 'center'}
            >
                {
                    imagesLoading
                        ? <Spinner size='big' />
                        :
                        <>
                            <AiImageSwiper isMobile={isMobile} images={images} />
                            <AiImagePrompt
                                isMobile={isMobile}
                                submitting={submitting}
                                formik={formik}
                                image={image}
                                renderPrompt={images?.length < 5 || false}
                                images={images}
                            />
                        </>
                }
            </Flexbox>
        </Flexbox>
    );
};


import { GraphQLClient, gql } from 'graphql-request'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Hero, } from '@components/ui'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react';
import HomeAllProductsGrid from '@components/common/HomeAllProductsGrid'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }
  const productsPromise = commerce.getAllProducts({
    variables: { first: 6 },
    config,
    preview,
    // Saleor provider only
    ...({ featured: true } as any),
  })
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })
  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  const endpoint = 'https://graphql.contentful.com/content/v1/spaces/ei8z56ft9sxn'

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: 'Bearer EdUFHgquVUFelN_OVeJC2WWgVuA-icAw5yh0Q7Lrdzk',
    },
  })

  const homeQuery= gql`
  {
    heroImageWidgetCollection(limit:1){
      items{
        heroImageHeadline
        heroImageDescription
        heroImageCta
        heroImageCollection
        imagesCollection (limit:2){
          items{
            url
          }
        }
      }
    }
    categoryFocusWidgetCollection(limit:1){
      items{
        widgetTitle
        collectionImageOverrideCollection(limit:10){
          items{
            title
            url
          }
        }
      }
    }      
  }
  
`
const data = await graphQLClient.request(homeQuery)


  return {
    props: {
      products,
      categories,
      brands,
      pages,
      heroWidgets : data.heroImageWidgetCollection.items,
      categoryWidgets:  data.categoryFocusWidgetCollection.items,

    },
    revalidate: 60,
  }
}

export default function Home({
  products,categories,brands,heroWidgets,categoryWidgets,
}: InferGetStaticPropsType<typeof getStaticProps>) {
console.log(heroWidgets)
  return (
    <>
     {heroWidgets.map((heroWidget : any) =>
         <div key="Hero widget" className="relative bg-black overflow-hidden">
           <div className="container mx-auto">
         <div className="md:flex items-center">
           <div className="md:basis-1/3">
           <div className="sm:text-center lg:text-left">
                       <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                         <span className="block text-white xl:inline">{heroWidget.heroImageHeadline}</span>
                         <span>{heroWidget.imagesCollection.items.url}</span>
                       </h1>
                       <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                        <span className='text-white'>{heroWidget.heroImageDescription}</span>
                       </p>
                       <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                         <div className="mt-3 sm:mt-0">
                           <a
                             href="#"
                             className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-black bg-white md:py-2 md:text-lg md:px-8"
                           >
                            Shop Now
                           </a>
                         </div>
                       </div>
                     </div>
           </div>
           {/* <div className="md:basis-1/3">
          <Image
                src={heroWidget.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={528}
               height={492}
               priority
              />
           </div> */}
           {/* <div className="md:basis-1/3">
           <Image
                src={homeBanner.heroImage2.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={528}
               height={492}
               priority
              />
           </div> */}
           </div>
           </div>
           </div>
           
        )}

<div className="container mx-auto">
{/* {homewidgets.map((homewidget : any) =>
         <div key="Collection slider widget" className="relative bg-white overflow-hidden">
           <div className="py-12 bg-white">
      <div className="mx-auto ">
        <div className="text-left">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {homeBanner.categoryFocusTitle}
          </p>
        </div>
      </div>
    </div>
           <Swiper 
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={16}
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
      breakpoints={{
        // when window width is >= 768px
        768: {
          width: 768,
          slidesPerView: 2,
        },
      }}
      slidesPerView={4}
    >
      
      <SwiperSlide>
        <div>
        <Image
                src={homeBanner.category1Image.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={394}
               height={450}
               priority
              />
        <h3 className="category-focus-title">{homeBanner.category1Title}</h3>
      </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
        <Image
                src={homeBanner.category2Image.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={394}
               height={450}
               priority
              />

        <h3 className="category-focus-title">{homeBanner.category2Title}</h3>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
        <Image
                src={homeBanner.category3Image.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={394}
               height={450}
               priority
              />

        <h3 className="category-focus-title">{homeBanner.category3Title}</h3>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div>
        <Image
                src={homeBanner.category4Image.url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={394}
               height={450}
               priority
              />

        <h3 className="category-focus-title">{homeBanner.category4Title}</h3>
        </div>
      </SwiperSlide>
    </Swiper>
         </div>
        )} */}


      <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={8}
      slidesPerView={3}
      navigation
    >
      {products.slice(0, 6).map((product: any, i: number) => (
          <SwiperSlide key={product.id}>
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
          </SwiperSlide>
        ))}
    </Swiper>



      {/* <HomeAllProductsGrid
        categories={categories}
        brands={brands}
      /> */}
      <div className="bg-white py-16 lg:py-24">
      <div className="relative mx-auto">
        <div className="relative py-24 px-8 bg-black rounded-xl shadow-2xl overflow-hidden lg:px-16 lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* <div className="absolute inset-0 opacity-50 filter saturate-0 mix-blend-multiply">
            <img
              src="https://images.unsplash.com/photo-1601381718415-a05fb0a261f3?ixid=MXwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8ODl8fHxlbnwwfHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1216&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div> */}
          <div className="relative lg:col-span-1">
            <blockquote className="mt-6 text-white">
              <p className="text-xl font-medium sm:text-2xl">
              Lorem ipsum dolor sit amet. 33 praesentium Quis sed commodi unde id quia ratione et repellendus praesentium. Sit exercitationem minima non laborum ratione vero cupiditate qui ullam aspernatur.
              </p>
              <footer className="mt-6">
                <p className="flex flex-col font-medium">
                  <span>Marie Chilvers</span>
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                         <div className="mt-3 sm:mt-0">
                           <a
                             href="#"
                             className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold text-black bg-white md:py-2 md:text-lg md:px-8"
                           >
                            Shop Now
                           </a>
                         </div>
                       </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
</div>

    </>
  )
}

Home.Layout = Layout

import { GraphQLClient, gql } from 'graphql-request'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Hero, } from '@components/ui'
import { Tab } from '@headlessui/react'
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
const tabs = [
  { name: 'My Account', href: '#', current: false },
  { name: 'Company', href: '#', current: false },
  { name: 'Team Members', href: '#', current: true },
  { name: 'Billing', href: '#', current: false },
]
function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function Home({
  products,categories,brands,heroWidgets,categoryWidgets,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
     {heroWidgets.map((heroWidget : any) =>
         <div key="Hero widget" className="relative bg-black overflow-hidden">
           <div className="container mx-auto">
         <div className="md:flex items-center">
           <div className="md:basis-1/3 pr-8">
           <div className="sm:text-center lg:text-left">
                       <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                         <span className="block text-white xl:inline">{heroWidget.heroImageHeadline}</span>
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
           <div className="md:basis-1/3 ">
          <Image
                src={heroWidget.imagesCollection.items[0].url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={528}
               height={492}
               priority
              />
           </div>
           <div className="md:basis-1/3">
           <Image
                src={heroWidget.imagesCollection.items[1].url}
                alt="Fifa Right Image"
               layout='intrinsic'
               width={528}
               height={492}
               priority
              />
           </div>
           </div>
           </div>
           </div>
           
        )}

<div className="container mx-auto">
{categoryWidgets.map((categoryWidget : any) =>
         <div key="Collection slider widget" className="relative bg-white overflow-hidden">
           <div className="py-12 bg-white">
      <div className="mx-auto ">
        <div className="text-left">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {categoryWidget.widgetTitle}
          </p>
        </div>
      </div>
    </div>
         </div>
        )}




<div className="bg-black px-10 py-8">
  <div>
  <div className="sm:flex sm:items-baseline sm:justify-between">
              <h2 id="category-heading" className="text-2xl font-extrabold tracking-tight text-gray-900">
                Shop by Category
              </h2>
              <a href="#" className="hidden text-sm font-semibold text-indigo-600 hover:text-indigo-500 sm:block">
                Browse all categories<span aria-hidden="true"> &rarr;</span>
              </a>
            </div>
        <div className="text-left ">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl ">
            PRODUCT CAROUSEL
          </p>
        </div>
  <Tab.Group>
      <Tab.List>
        <Tab className="bg-black text-white py-2 px-8 uppercase font-bold mr-5 border border-white">Men</Tab>
        <Tab className="bg-black text-white py-2 px-8 uppercase font-bold mr-5 border border-white">Womens</Tab>
        <Tab className="bg-black text-white py-2 px-8 uppercase font-bold mr-5 border border-white">Kids</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={8}
      slidesPerView={3.5}
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
    </Swiper></Tab.Panel>
        <Tab.Panel><Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={8}
      slidesPerView={3.5}
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
    </Swiper></Tab.Panel>
        <Tab.Panel><Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={8}
      slidesPerView={3.5}
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
    </Swiper></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
    </div>
</div>




<section aria-labelledby="category-heading">
          <div className="mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2">
              <div className="group aspect-w-2 aspect-h-1 overflow-hidden sm:aspect-h-1 sm:aspect-w-1 sm:row-span-2">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-03-featured-category.jpg"
                  alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
                  className="object-center object-cover group-hover:opacity-75"
                />
                <div aria-hidden="true" className="bg-gradient-to-b from-transparent to-black opacity-50" />
                <div className="p-6 flex items-end">
                  <div>
                    <h3 className="font-semibold text-white">
                      <a href="#">
                        <span className="absolute inset-0" />
                        New Arrivals
                      </a>
                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
              <div className="group aspect-w-2 aspect-h-1 overflow-hidden sm:relative sm:aspect-none sm:h-full">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-01.jpg"
                  alt="Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters."
                  className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
                />
                <div
                  aria-hidden="true"
                  className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                />
                <div className="p-6 flex items-end sm:absolute sm:inset-0">
                  <div>
                    <h3 className="font-semibold text-white">
                      <a href="#">
                        <span className="absolute inset-0" />
                        Accessories
                      </a>
                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
              <div className="group aspect-w-2 aspect-h-1 overflow-hidden sm:relative sm:aspect-none sm:h-full">
                <img
                  src="https://tailwindui.com/img/ecommerce-images/home-page-03-category-02.jpg"
                  alt="Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."
                  className="object-center object-cover group-hover:opacity-75 sm:absolute sm:inset-0 sm:w-full sm:h-full"
                />
                <div
                  aria-hidden="true"
                  className="bg-gradient-to-b from-transparent to-black opacity-50 sm:absolute sm:inset-0"
                />
                <div className="p-6 flex items-end sm:absolute sm:inset-0">
                  <div>
                    <h3 className="font-semibold text-white">
                      <a href="#">
                        <span className="absolute inset-0" />
                        Workspace
                      </a>
                    </h3>
                    <p aria-hidden="true" className="mt-1 text-sm text-white">
                      Shop now
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        <div>
      <ul role="list" className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <li key="under tiles" className="col-span-1 flex shadow-sm rounded-md">
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href="under" className="text-gray-900 font-medium hover:text-gray-600">
                  Under 50
                </a>
              </div>
            </div>
          </li>
          <li key="under tiles" className="col-span-1 flex shadow-sm rounded-md">
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href="under" className="text-gray-900 font-medium hover:text-gray-600">
                  Under 50
                </a>
              </div>
            </div>
          </li>
          <li key="under tiles" className="col-span-1 flex shadow-sm rounded-md">
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href="under" className="text-gray-900 font-medium hover:text-gray-600">
                  Under 50
                </a>
              </div>
            </div>
          </li>
          <li key="under tiles" className="col-span-1 flex shadow-sm rounded-md">
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <a href="under" className="text-gray-900 font-medium hover:text-gray-600">
                  Under 50
                </a>
              </div>
            </div>
          </li>
      </ul>
    </div>




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
    <HomeAllProductsGrid
        categories={categories}
        brands={brands}
      />
</div>

    </>
  )
}

Home.Layout = Layout

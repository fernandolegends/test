import { GraphQLClient, gql } from 'graphql-request'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Hero, } from '@components/ui'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// import CollectionTabs from '@components/ui/CollectionTabs'
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
    homeHeroBannerCollection {
      items {
        heading
        description
        heroImagesCollection {
          items {
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
      homeBanners : data.homeHeroBannerCollection.items,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,categories,brands,homeBanners,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
     {homeBanners.map((homeBanner : any) =>
        <Hero
        key={homeBanner.id}
        headline={homeBanner.heading}
        description={homeBanner.description}
      />
        )}

       <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={50}
      slidesPerView={3}
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
    >
      <SwiperSlide>Womens Jumper</SwiperSlide>
      <SwiperSlide>Mens Accessories</SwiperSlide>
      <SwiperSlide>Mens Jumpers</SwiperSlide>
      <SwiperSlide>Mens</SwiperSlide>
    </Swiper>
      {/* <CollectionTabs></CollectionTabs> */}
      {/* <Grid variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
              priority: true,
            }}
          />
        ))}
      </Grid> */}
      <Grid layout="normal" variant="filled">
        {products.slice(0, 6).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              width: i === 0 ? 1080 : 540,
              height: i === 0 ? 1080 : 540,
            }}
          />
        ))}
      </Grid>
      <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination, Scrollbar, A11y]}
      spaceBetween={16}
      slidesPerView={3}
      navigation
      onSwiper={(swiper) => console.log(swiper)}
      onSlideChange={() => console.log('slide change')}
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
      <HomeAllProductsGrid
        categories={categories}
        brands={brands}
      />
    </>
  )
}

Home.Layout = Layout

import cn from 'clsx'
import { inherits } from 'util'
import s from './ProductTag.module.css'

interface ProductTagProps {
  className?: string
  name: string
  price: string
  fontSize?: number
}

const ProductTag: React.FC<ProductTagProps> = ({
  name,
  price,
  className = '',
}) => {
  return (
    <div className={cn(s.root, className)}>
      <h3 className="product-card-title">
        {name}
      </h3>
      <div className="product-card-price">{price}</div>
    </div>
  )
}

export default ProductTag

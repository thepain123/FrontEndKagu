import { Component, OnInit } from "@angular/core";
import { DataService } from "src/app/shared/data.service";
import { Router, ActivatedRoute } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import Swal from "sweetalert2";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  relatedProductList: any = [];
  product_id: any;
  product_detail: any;
  bigImage: any;
  quantity: number = 1;
  comment_list: any;
  constructor(
    private _dataService: DataService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private activeatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.title.setTitle("Chi tiết sản phẩm");
    this.meta.updateTag({
      name: "description",
      content: "Mô tả chi tiết bàn ghế sofa",
    });

    this.getParamsFromURL();
    this.getRelatedProducts();
    this.getProductReview();
  }
  getProductReview() {
    let uri = "data/get-comment-product";
    let message = {
      productId: this.product_id,
      page: 0,
    };
    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        console.log(data);

        this.comment_list = data.data;
        console.log(this.comment_list);
      },
      (err: any) => {}
    );
  }
  getParamsFromURL() {
    // this.maPhim = this.activeatedRoute.snapshot.paramMap.get("id");

    this.activeatedRoute.queryParams.subscribe((params: any) => {
      this.product_id = params.maSP;
      console.log(this.product_id);
      this.getProductDetail();
    });
  }
  getRelatedProducts() {
    const uri = "data/get-related-products";
    let message = {
      productId: this.product_id,
    };
    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        this.relatedProductList = data.data;
        for (let i = 0; i < this.relatedProductList.length; i++) {
          let temp, convert: number;
          temp = +this.relatedProductList[i].product_price;
          convert = temp.toLocaleString();
          this.relatedProductList[i].product_price = convert.toString();
        }
      },
      (err: any) => {}
    );
  }
  getProductDetail() {
    const uri = "data/get-product-detail";
    console.log(this.product_id);
    let message = {
      productId: this.product_id,
    };
    this._dataService.post(uri, message).subscribe(
      (data: any) => {
        this.product_detail = data.data[0];
        console.log(this.product_detail);
        this.bigImage = this.product_detail.image[0].product_image;
        let temp, convert: number;
        temp = +this.product_detail.product_price;
        this.product_detail = { ...this.product_detail, priceNum: temp };
        // format price 10000 => 10.000
        convert = temp.toLocaleString("de-DE");
        this.product_detail.product_price = convert.toString();
      },
      (err: any) => {}
    );
  }
  pickImage(url) {
    this.bigImage = url;
  }
  showProductDetail(product_id) {
    this.router.navigate([`/chi-tiet`], {
      queryParams: { maSP: product_id },
    });
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 100); // how far to scroll on each step
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
  raiseQuantity() {
    if (this.quantity < 100) {
      this.quantity = ++this.quantity;
    }
  }
  reduceQuantity() {
    if (this.quantity > 1) {
      this.quantity = --this.quantity;
    }
  }
  addToCart() {
    let product = {
      productId: this.product_detail.product_id,
      productName: this.product_detail.product_name,
      productPrice: this.product_detail.product_price,
      productImage: this.product_detail.image[1].product_image,
      totalPrice: 0,
      priceNum: this.product_detail.priceNum,
      quantity: this.quantity,
    };
    // calculate totalPrice
    product.totalPrice = +product.priceNum * product.quantity;

    if (localStorage.getItem("cart")) {
      let cart = JSON.parse(localStorage.getItem("cart"));
      if (cart.length > 0) {
        let flag = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].productId == product.productId) {
            cart[i].quantity += product.quantity;
            cart[i].totalPrice = cart[i].priceNum * cart[i].quantity;
            flag = true;
          }
        }
        if (!flag) {
          cart.push(product);
        }
      } else {
        cart.push(product);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      let cart: any = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      this.addToCart();
    }
    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Thêm vào giỏ hàng thành công",
      showConfirmButton: false,
      timer: 1000,
    });
  }
}

import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({

  name : { 
    type : String, 
    required : [true, 'Subscription is required!'],
    trim: true,
    minLength: 2,
    maxLength: 100, 
  },

  price : {
    type: Number,
    required : [true, 'Subscription price is required!'],
    min: [0, 'Price must be greater than 0!'],
  },

  currency : {
    type: String,
    enum : ['USD', 'EUR', "GBP", 'SGD'],
    required : true,
    default : 'USD'
  },

  frequency : {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required : true,
  },

  category : {
    type : String,
    required : true
  },

  status : {
    type : String,
    enum : ['active', 'paused', 'cancelled', 'expired'],
    default : 'active'
  },

  startDate : {
    type : Date,
    required : true,
    validate : {
      validator : (value) => value <= new Date(),
      message : 'Start date must be in the past' 
    }
  },

  renewalDate : {
    type : Date,
    validate : {
      validator : (value) => value > startDate,
      message : 'Renewal date must be after start date'  
    }
  },

  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true,
    index : true,
  }


}, options={timestamp : true})

// Auto Calculate renewal date if missing
subscriptionSchema.pre('save', (next) => {

  if (!this.renewalDate) {
    const renewalPeriods = {
      daily : 1,
      weekly : 7,
      monthly: 30,
      yearly: 365,
    }

    this.renewalDate = new Date(this.startDate);
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  if (this.renewalDate < new Date()) {
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
  }

  next();

});

// Create Model
const Subscription = new mongoose.model('Subscription', subscriptionSchema);
export default Subscription;

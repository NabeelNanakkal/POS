import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    hireDate: {
      type: Date,
      required: [true, 'Hire date is required'],
      default: Date.now,
    },
    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
employeeSchema.index({ employeeId: 1 });
employeeSchema.index({ store: 1, isActive: 1 });

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;

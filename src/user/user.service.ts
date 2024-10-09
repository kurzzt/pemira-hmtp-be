import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { Query } from 'express-serve-static-core';
import { faker } from '@faker-js/faker';
import { MailService } from 'src/mail/mail.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteBulkDto } from './dto/delete-bulk-user.dto';

import * as bcrypt from 'bcrypt';
import toStream = require('buffer-to-stream');
import * as csv from 'csv-parser';
import { SendBulkCredDto } from './dto/send-bulk-cred.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private mailService: MailService,
  ) { }

  async validateNIM(nim: string) {
    return await this.userModel.findOne({ nim });
  }
  async validateEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async isExist(id: string) {
    return await this.userModel.findById(id, '+isAdmin');
  }

  async createUser(body: CreateUserDto) {
    const { isAdmin } = body;

    if (isAdmin) {
      const { nim, email, name, password } = body;
      const pass = await bcrypt.hash(password, 10);
      const response = await this.userModel.create({
        nim,
        email,
        name,
        isAdmin,
        password: pass,
      });

      return response;
    } else {
      const { nim, email, name, yearClass } = body;
      const response = await this.userModel.create({
        nim,
        email,
        name,
        yearClass,
      });
      return response;
    }
  }

  private async parseCsvToJSON(file: Express.Multer.File) {
    const stream = toStream(file.buffer);

    const jsonRows = [];
    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          jsonRows.push(row);
        })
        .on('end', () => {
          resolve(jsonRows);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private async parseCsvAndValidate(file: Express.Multer.File) {
    const stream = toStream(file.buffer);

    const jsonRows = [];
    const errors = [];
    const seenEmails = new Map(); 
    const seenNims = new Map();
    let index = 2;

    return new Promise((resolve, reject) => {
      stream
      .pipe(csv())
      .on('data', (row) => {
        const errorMessages = [];

        row.email = row.email ? row.email.trim() : "";
        row.nim = row.nim ? row.nim.trim() : "";
        
        // Validate required attributes
        if (!row.name) errorMessages.push("Name is required.");
        if (!row.nim) errorMessages.push("NIM is required.");
        if (!row.yearClass) errorMessages.push("Year class is required.");
        if (!row.email) errorMessages.push("Email is required.");

        // Validate data types and format
        if (row.nim && !/^\d{14}$/.test(row.nim)) {
            errorMessages.push("NIM must be 14 digits.");
        }
        if (row.email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(row.email)) {
            errorMessages.push(`Invalid email format with value '${row.email}' on index ${index}`);
        }
        if (row.yearClass && !/^\d{4}$/.test(row.yearClass)) {
            errorMessages.push(`Year class must be a 4-digit number on index ${index}`);
        }

        // Validate uniqueness of email and nim
        if (seenEmails.has(row.email)) {
          const firstIndex = seenEmails.get(row.email);
          errorMessages.push(`Duplicate email with value '${row.email}'. First occurrence at index ${firstIndex}, duplicate on index ${index}`);
        } else {
          seenEmails.set(row.email, index); // Store email with its index
        }

        if (seenNims.has(row.nim)) {
          const firstIndex = seenNims.get(row.nim);
          errorMessages.push(`Duplicate NIM with value '${row.nim}'. First occurrence at index ${firstIndex}, duplicate on index ${index}`);
        } else {
          seenNims.set(row.nim, index); // Store NIM with its index
        }

        if (errorMessages.length > 0) {
          errorMessages.map((d) => errors.push(d));
        } else {
          jsonRows.push(row);
        }

        index++;
      })
      .on('end', () => {
        if (errors.length > 0) {
          reject(errors);
        } else {
          resolve(jsonRows);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
    });
  }


  async bulkData(file: Express.Multer.File) {
    try {
      const csvData = await this.parseCsvAndValidate(file);
      const res = await this.userModel.insertMany(csvData);
      return res;
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  // FIXME: ALSO DELETE VOTE
  async deleteUserById(id: string): Promise<User> {
    const response = await this.userModel.findByIdAndDelete(id);
    return response;
  }

  async deleteBulk(body: DeleteBulkDto) {
    const { user } = body
    const response = await this.userModel.deleteMany(
      { _id: { $in: user } },
      { new: true, runValidators: true }
    )
    return response
  }

  async deleteAllNonAdmin(){
    return await this.userModel.deleteMany({ isAdmin: false })
  }
  
  async updateUserById(id: string, body: UpdateUserDto): Promise<User> {
    const { nim, email, name, yearClass } = body

    const response = await this.userModel.findByIdAndUpdate(
      id,
      { nim, email, name, yearClass },
      { new: true, runValidators: true }
    )
    return response
  }

  async findAllNonAdmin(q: Query) {
    const param = { isAdmin: false };
    const response = await this.userModel.find({ ...param })
    return response;
  }

  async findAllAdmin(q: Query, user: string): Promise<User[]> {
    const param = { isAdmin: true, _id: { $ne: user } };
    const response = await this.userModel.find({ ...param }, '-vote -yearClass')
    return response;
  }

  async findUserById(id: string): Promise<User> {
    const response = await this.userModel.findById(id);
    return response;
  }

  async sendCredentials(id: string) {
    const random_passwd = faker.string.alpha(12);
    const password = await bcrypt.hash(random_passwd, 10);
    const response = await this.userModel.findByIdAndUpdate(id, { password });
    try {
      await this.mailService.sendCred(response, random_passwd)
    } catch (e) {
      throw new BadRequestException('Failed on sending the user credentials')
    }

    return response;
  }

  async sendBulkCred(body: SendBulkCredDto){
    const { user } = body

    await user.forEach((userId, _) => {
      this.sendCredentials(userId)
    })

    return "success"
  }

  async updateVoteField(id: string, voted: boolean){
    const response = await this.userModel.findByIdAndUpdate(
      id,
      { voted },
      { new: true, runValidators: true }
    )
    return response
  }

  async updateAllVoteField(){
    const response = await this.userModel.updateMany({}, { voted: false } )
    return response
  }

  async login(email_nim: string): Promise<User> {
    const response = await this.userModel.findOne({
      $or: [{ email: email_nim }, { nim: email_nim }],
    }, '+password +isAdmin');
    return response;
  }

  async nonAdminLoginMethod(nim: string): Promise<User>{
    const response = await this.userModel.findOne({ nim }, '+password +isAdmin')
    return response
  }

  async adminLoginMethod(email: string): Promise<User>{
    const response = await this.userModel.findOne({ email }, '+password +isAdmin')
    return response
  }

  async totalNonAdminUser(){
    const response = await this.userModel.countDocuments({ isAdmin: false })
    return response
  }

  async totalAdminUser(){
    const response = await this.userModel.countDocuments({ isAdmin: true })
    return response
  }
}

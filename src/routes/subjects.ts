import { and, desc, eq, getTableColumns, ilike, or, sql } from 'drizzle-orm';
import express from 'express';
import { departments, subjects } from '../db/schema';

 import {db} from "../db"


const router=express.Router();


//Get all subjects with optional search and filtering and pagination

router.get('/', async (req,res)=>{


    try {
        const {search,department,page=1,limit=10} = req.query;

        const currentPage= Math.max(1,parseInt(String(page),10) || 1);
        const limitPerpage= Math.min(Math.max(1,parseInt(String(limit),10) || 10),100);

       

        const offset=(currentPage-1)*limitPerpage;

        const filterConditions = [];  

        // if serach query exists , filter by subject name or code 
        if (search) {
            filterConditions.push(
                or(
                    ilike(subjects.name, `%${search}%`),
                    ilike(subjects.code, `%${search}%`),
                )
            );
        }

        // if department filter exists , match department name

        if(department){
           const deptPattern=`%${String(department).replace(/[%_]/g, '\\$&')}%`; // Escape % and _ characters
           filterConditions.push(ilike(departments.name,deptPattern) );
           
            
        }

        // Combine all filter conditions using AND if any exist
        const whereClause = filterConditions.length > 0 ?  and(...filterConditions) : undefined;

        const countResult= await db
        .select({count: sql<number>`count(*)`})
        .from(subjects)
        .leftJoin(departments, eq(subjects.departmentId,departments.id))
        .where(whereClause);


        const totalCount=countResult[0]?.count ?? 0;

        const subjectsList=await db
        .select({
            ...getTableColumns(subjects),
            department:{...getTableColumns(departments)}
        })
        .from(subjects).leftJoin(departments,eq(subjects.departmentId,departments.id))
        .where(whereClause)
        .orderBy(desc(subjects.createdAt))
        .limit(limitPerpage)
        .offset(offset);


        res.json({
            data:subjectsList,
            pagination:{
                page:currentPage,
                limit:limitPerpage,
                total:totalCount,
                totalPages:Math.ceil(totalCount/limitPerpage)
            }
        })

   




        
    } catch (e) {
        console.error(`GET /subjects error: ${e}`);
        res.status(500).json({error: 'Failed to fetch subjects' });
        
    }
})

export default router;

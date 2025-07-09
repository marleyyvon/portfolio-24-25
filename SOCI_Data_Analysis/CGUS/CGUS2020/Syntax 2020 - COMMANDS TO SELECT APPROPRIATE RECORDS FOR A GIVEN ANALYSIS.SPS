* Encoding: windows-1252.
*******************************************************************************************************.
*******************************************************************************************************.
*******************************************************************************************************.
**************************************HERE DOWN - syntax to select cases from 2020 study.
*******************************************************************************************************.
*******************************************************************************************************.
*******************************************************************************************************.


**************************************************All COMPLETED interviews Caregivers of someone age 18+ base study.
weight by Ind14wgt.
select if status=1.
select if (year=2019 and smptyp14<5 and (agecrcat=2 or agecrcat=3)).

OR

weight by Ind14wgt.
compute filttemp=0.
if (status=1 and year=2019 and smptyp14<5 and (agecrcat=2 or agecrcat=3)) filttemp=1.
filter by filttemp.

**************************************************All COMPLETED interviews Caregivers of child under age 18 base study.
weight by Ind14wgt.
select if status=1.
select if (year=2019 and smptyp14<5 and agecrcat=1).

OR

weight by Ind14wgt.
compute filttemp=0.
if (status=1 and year=2019 and smptyp14<5 and agecrcat=1) filttemp=1.
filter by filttemp.

*************************************************All FULLY SCREENED respondents from base study to calc individual prevalence of caregiving.
weight by Ind14wgt.
select if (year=2019 and smptyp14<5).

OR

weight by Ind14wgt.
compute filttemp=0.
if (year=2019 and smptyp14<5) filttemp=1.
filter by filttemp.


*************************************************All caregivers of recipients 50+ completed interviews - base study.
weight by Ind14wgt.
select if (smptyp14<5 and year=2019 and status=1 and agecrcat=3).

OR

weight by Ind14wgt.
compute filttemp=0.
if (smptyp14<5 and year=20149 and status=1 and agecrcat=3) filttemp=1.
filter by filttemp.


*************************************************All caregivers of recipients 18-49 completed interviews - base study.
weight by Ind14wgt.
select if (smptyp14<5 and year=2019 and status=1 and agecrcat=2).

OR

weight by Ind14wgt.
compute filttemp=0.
if (smptyp14<5 and year=2019 and status=1 and agecrcat=2) filttemp=1.
filter by filttemp.



****************************************Asian - American caregivers of someone 18+ - completed interviews from all samples.
weight by wgtAcg.
select if ((smptyp14<5 or smptyp14=7) and year=2019 and status=1 and racecg=3 and (agecrcat=2 or agecrcat=3)).

OR

weight by wgtAcg.
compute filttemp=0.
if ((smptyp14<5 or smptyp14=7) and year=2019 and status=1 and racecg=3 and (agecrcat=2 or agecrcat=3)) filttemp=1.
filter by filttemp.


****************************************Caregivers Age 65+ - completed interviews from all samples.
weight by wgt65plus.
select if (smptyp14<7 and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>64 and agecg<998)).

OR

weight by wgt65plus.
compute filttemp=0.
if (smptyp14<7 and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>64 and agecg<998)) filttemp=1.
filter by filttemp.



****************************************Caregivers Age 65 to 74 - completed interviews from all samples.
weight by wgt6574.
select if (smptyp14<6 and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>64 and agecg<75)).

OR

weight by wgt6574.
compute filttemp=0.
if (smptyp14<6 and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>64 and agecg<75)) filttemp=1.
filter by filttemp.




****************************************Caregivers Age 75+ - completed interviews from all samples.
weight by wgt75plus.
select if ((smptyp14<5 or smptyp14=6) and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>74 and agecg<998)).

OR

weight by wgt75plus.
compute filttemp=0.
if ((smptyp14<5 or smptyp14=6) and year=2019 and status=1 and (agecrcat=2 or agecrcat=3) and (agecg>74 and agecg<998)) filttemp=1.
filter by filttemp.






*******************************************************************************************************.
*******************************************************************************************************.
*******************************************************************************************************.
**************************************HERE DOWN - syntax to select cases from 2015 study.
*******************************************************************************************************.
*******************************************************************************************************.
*******************************************************************************************************.

**************************************************All COMPLETED interviews Caregivers of someone age 18+ base study.
weight by Ind14wgt.
select if status=1.
select if (year=2014 and smptyp14<5).

OR

weight by Ind14wgt.
compute filttemp=0.
if (status=1 and year=2014 and smptyp14<5) filttemp=1.
filter by filttemp.

*************************************************All FULLY SCREENED respondents from base study to calc individual prevalence of caregiving.
weight by Ind14wgt.
select if (year=2014 and smptyp14<5).

OR

weight by Ind14wgt.
compute filttemp=0.
if (year=2014 and smptyp14<5) filttemp=1.
filter by filttemp.


*************************************************All caregivers of recipients 50+ completed interviews - base study.
weight by Ind14wgt.
select if (smptyp14<5 and year=2014 and status=1 and agecrcat=3).

OR

weight by Ind14wgt.
compute filttemp=0.
if (smptyp14<5 and year=2014 and status=1 and agecrcat=3) filttemp=1.
filter by filttemp.


*************************************************All caregivers of recipients 18-49 completed interviews - base study.
weight by Ind14wgt.
select if (smptyp14<5 and year=2014 and status=1 and agecrcat=2).

OR

weight by Ind14wgt.
compute filttemp=0.
if (smptyp14<5 and year=2014 and status=1 and agecrcat=2) filttemp=1.
filter by filttemp.



****************************************Asian - American caregivers of someone 18+ - completed interviews from all samples.
weight by wgtAcg.
select if ((smptyp14<5 or smptyp14=7) and year=2014 and status=1 and racecg=3).

OR

weight by wgtAcg.
compute filttemp=0.
if ((smptyp14<5 or smptyp14=7) and year=2014 and status=1 and racecg=3) filttemp=1.
filter by filttemp.


****************************************Caregivers Age 65+ - completed interviews from all samples.
weight by wgt65plus.
select if (smptyp14<7 and year=2014 and status=1 and (agecg>64 and agecg<998)).

OR

weight by wgt65plus.
compute filttemp=0.
if (smptyp14<7 and year=2014 and status=1 and (agecg>64 and agecg<998)) filttemp=1.
filter by filttemp.



****************************************Caregivers Age 65 to 74 - completed interviews from all samples.
weight by wgt6574.
select if (smptyp14<6 and year=2014 and status=1 and (agecg>64 and agecg<75)).

OR

weight by wgt6574.
compute filttemp=0.
if (smptyp14<6 and year=2014 and status=1 and (agecg>64 and agecg<75)) filttemp=1.
filter by filttemp.




****************************************Caregivers Age 75+ - completed interviews from all samples.
weight by wgt75plus.
select if ((smptyp14<5 or smptyp14=6) and year=2014 and status=1 and (agecg>74 and agecg<998)).

OR

weight by wgt75plus.
compute filttemp=0.
if ((smptyp14<5 or smptyp14=6) and year=2014 and status=1 and (agecg>74 and agecg<998)) filttemp=1.
filter by filttemp.

